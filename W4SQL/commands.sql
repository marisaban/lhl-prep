SELECT statements are broken up into six clauses:

SELECT - list the data you wanna get

FROM - list the tables you wanna get data from 

WHERE - filter down which rows are gonna come in the output 

GROUP BY - treat a bunch of rows that would have been in the output as a single rows

HAVING - is like WHERE for the result of aggregated data

ORDER BY - what order do you want the resulting rows to come back in

SELECT users.id, users.name FROM users