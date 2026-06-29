
create DATABASE yy_coaches;

USE yy_coaches;

CREATE TABLE bookings (

    booking_id varchar(5) primary key,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(10) NOT NULL ,
    email VARCHAR(20) NOT NULL,
    departure VARCHAR(10) NOT NULL,
    destination VARCHAR(10) NOT NULL,
	time varchar(15) not null,
    travel_date DATE NOT NULL,
    passengers INT NOT NULL,
    payment_method varchar(10) not null
    );
show tables;