require 'json'
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

json = File.read('data/tweets.json')
tweets = JSON.parse(json)

tweets.each do |id, tweet|
  Tweet.create!(
    twitter_id: tweet['id_str'],
    text: tweet['text'],
    created_at: tweet['created_at'],
    retweeted_id: if tweet.include?('retweeted_status') then tweet['retweeted_status']['id_str'] end
  )
end
