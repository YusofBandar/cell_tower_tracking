# cell_tower_tracking
Simply carrying your cell/modile phone can be enough to locate you. Greatly inspired byt the New York Times Article [Twelve Million Phones, 
One Dataset, Zero Privacy](https://www.nytimes.com/interactive/2019/12/19/opinion/location-tracking-cell-phone.html). 
Cell Tower Tracking is a simple application to show how cell/mobile towers can be used to locate an indivdual.

![Example of London](https://github.com/YusofBandar/cell_tower_tracking/blob/master/docs/screenshot/london.gif)

## Cell Tower Locations
Cell tower locations were obtained using the https://opencellid.org database (requires sign-up). For prototype purposes I filtered the 
data to only include cell towers within the south of England, I went from 2 millions rows to 22,000.

## File Structure

`app.js` Web application

`server.js` express server to serve cell tower locations

`data.js` scripts to filter and format cell tower data


## Examples

### London

![Example of London](https://github.com/YusofBandar/cell_tower_tracking/blob/master/docs/screenshot/london.gif)

### Heathrow

![Example of Heathrow](https://github.com/YusofBandar/cell_tower_tracking/blob/master/docs/screenshot/heathrow.gif)

### Reading

![Example of Reading](https://github.com/YusofBandar/cell_tower_tracking/blob/master/docs/screenshot/reading.gif)
