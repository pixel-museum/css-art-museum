go to https://www.mongodb.com/cloud/atlas/register 
create a account here
create a cluster in the free tier
you will get a username and password and a url like the below

mongodb+srv://<username>:<password>@css-art-museum.umif2pm.mongodb.net/?retryWrites=true&w=majority&appName=css-art-museum

Now go to network access and add a new ip as 0.0.0.0


Now go to https://dashboard.render.com/login
create a account here

create new -> static site -> select your repo
root directory : ./server
build command : npm run start


In environment variable 
MONGO_URI 
and your mongo uri you got in value

keep the name same other wise will not work

hit deploy static site

Done if any problmes faced ask me.