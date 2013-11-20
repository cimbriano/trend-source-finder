== README

* Dependencies
Install dependecies specified in Gemfile.
```bundle install```

* Database

Drop database
```rake db:drop```

Runs migrations (Build up database from files in db/migrate)
```rake db:migrate```

Runs db/seed.rb to add data to database
```rake db:seed```
