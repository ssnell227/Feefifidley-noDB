create table game (
    game_id serial primary key,
    playlist varchar(100),
    score int,
    song_list text
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