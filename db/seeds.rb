# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Tweet.create!([ {tweet_id: 12345, text: "Hello World, here is my tweet"},
                {tweet_id: 78910, text: "Anoter tweet from me" } ])
