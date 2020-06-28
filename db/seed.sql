create table game (
    game_id serial primary key,
    playlist varchar(100),
    playlist_id foreign key references loaded_playlists(id)
    score int,
    song_list text,
    user_list text,
    winner varchar(100)
);

create table users (
    user_id serial primary key,
    username varchar(100),
    hash text,
    isAdmin boolean
);

create table game_auth_link (
    id serial primary_key,
    user_id int references users(user_id),
    game_id int references game(game_id)
);

create table loaded_playlists (
    id serial primary key,
    playlist_name varchar(200),
    spotify_id text
    img_url text
);