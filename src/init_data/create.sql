drop table if exists users cascade;
create table users(
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

drop table if exists songs cascade;
create table songs(
    song_id serial primary key,
    song_name varchar(100) not null,
    artist_name varchar(100) not null,
    length_in_sec int not null,
    weather_label varchar(100) not null
);

-- Test User - Username: asdf, Password: asdf
insert into users (username, password) values
('asdf', '$2b$10$ylYVvQjCCdTn1bzrkjBOM.yzz3FwLCnHWvVRJEQvJyjuvwaeopZ0a');

insert into songs (song_name, artist_name, length_in_sec, weather_label) values 
('Never Be Like You (feat. Kai)', 'Flume', 235, 'Summer');