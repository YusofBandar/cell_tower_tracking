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