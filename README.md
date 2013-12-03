# README

## Dependencies
Install dependecies specified in Gemfile.
```bundle install```

## Database

### Drop database
```rake db:drop```

### Runs migrations (Build up database from files in db/migrate)
```rake db:migrate```

### Runs db/seed.rb to add data to database
```rake db:seed```

#### Optional Dataset Parameter

```rake db:seed dataset=small``` : Load small dataset (10 tweets)
```rake db:seed dataset=medium``` : Load medium dataset (100 tweets)