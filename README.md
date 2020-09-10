# cell_tower_tracking
Simply carrying your cell/modile phone can be enough to locate you. Greatly inspired byt the New York Times Article [Twelve Million Phones, 
One Dataset, Zero Privacy](https://www.nytimes.com/interactive/2019/12/19/opinion/location-tracking-cell-phone.html). 
Cell Tower Tracking is a simple application to show how cell/mobile towers can be used to locate an indivdual.

![Example of London](https://github.com/YusofBandar/cell_tower_tracking/blob/master/docs/screenshot/london.gif)

## Cell Tower Locations

## How To Deploy
Deploying the application locally or on server is relatively easy. The application consists of two parts the Client 
and the API. The client requires the creation of a [Google Clound account](https://cloud.google.com/) and the API requires a 
[OpenCellid](https://opencellid.org/#zoom=16&lat=37.77889&lon=-122.41942) account.

### Client Deploy

#### Google Maps API
First step is to generate a Google Maps API key ( you will need a billing account with the Google Cloud platform ).
Simply follow the [Google Maps documentation](https://developers.google.com/maps/documentation/javascript/get-api-key) to generate a API key.

#### Client Run
Before deploying you will need to add the Google Maps API key to the script tag located within `public/index.html`.

run `export APIKEY=[API_KEY]; npm start` to deploy the client.

### Server Deploy

#### Cell Tower Data
First step is to retrieve the necessary cell tower data. I found [OpenCellid](https://opencellid.org/#zoom=16&lat=37.77889&lon=-122.41942) to be one the best
sources, simply create an free account and download the cell tower data for your country.

*note any mcc/mnc will work*

Depending on certain usecases it might be useful to filter the data. Below is a bash command to filter the data to a certain location.
To filter, set your desired minimum and maxiumum coordinates. The filtered data will be written to `output.csv`.

`awk -F "," 'BEGIN{minLong=-[MIN_LONG];  minLat=[MIN_LAT]; maxLong=[MAX_LONG]; maxLat=[MAX_LAT];} NR==1; {if ($7 > minLong && $7 < maxLong && $8 > minLat && $8 < maxLat) { print } }' output.csv`

#### Postgres Database
The cell tower data is stored on a Postgres database which can either be deployed locally or on a remote server. Follow the [Postgres documentation](https://www.postgresql.org/) to install.

Once Postgres is installed create a empty database and run the sql command below to create a *towers* table.

```

CREATE TABLE towers(
	id SERIAL UNIQUE PRIMARY KEY,
	radio VARCHAR (20) NOT NULL,
	mcc numeric NOT NULL,
	net numeric NOT NULL,
	area numeric NOT NULL,
	cell numeric NOT NULL,
	unit numeric NOT NULL,
	lon numeric NOT NULL,
	lat numeric NOT NULL,
	range numeric NOT NULL,
	samples numeric NOT NULL,
	changeable numeric NOT NULL,
	created numeric NOT NULL,
	updated numeric NOT NULL,
	averageSignal numeric NOT NULL
);

``` 

Lasty we need to populate our database with some data! The bash command below reads from `output.csv` and inserts each row into the towers table.

```
LINES=$(awk 'END {print NR}' output.csv); awk -F "," -v lines=$LINES '{ if (NR==1) { print "INSERT INTO towers("$0") \nVALUES" }}; { NR != lines ? end="," : end=";" }; { if(NR !=1) { print "('\''"$1"'\'',"$2","$3","$4","$5","$6","$7","$8","$9","$10","$11","$12","dd$13"
,"$14")" end }};' output.csv | psql -U [DATABASE_USER] -d [DATABASE_NAME]

```
To deploy the server run `npm start` with the following env vars

```
HOST - uri of postgres database (e.g. localhost)
DATABASE - database name
PASSWORD - database password
USER = database user

```

## Examples

### London

![Example of London](https://github.com/YusofBandar/cell_tower_tracking/blob/master/docs/screenshot/london.gif)

### Heathrow

![Example of Heathrow](https://github.com/YusofBandar/cell_tower_tracking/blob/master/docs/screenshot/heathrow.gif)

### Reading

![Example of Reading](https://github.com/YusofBandar/cell_tower_tracking/blob/master/docs/screenshot/reading.gif)
