select playlist, score, g.game_id, gal.user_id
from game g
join game_auth_link gal on g.game_id = gal.game_id
where gal.user_id = $1
and score is not null
order by score desc
limit 3;
