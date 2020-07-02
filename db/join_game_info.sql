select game.game_id, pl.id, pl.playlist_name, pl.img_url
from game
join loaded_playlists pl on game.playlist_id = pl.id
where game.game_id = $1;