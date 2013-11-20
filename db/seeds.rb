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

tweets.each do |id, tweet_json|

  puts "Making Child Tweet"
  # Child Tweet
  child = Tweet.create!(
    twitter_id: tweet_json['id_str'],
    text: tweet_json['text'],
    created_at: tweet_json['created_at'],
    retweeted_id: if tweet_json.include?('retweeted_status') then tweet_json['retweeted_status']['id_str'] end
  )

  if tweet_json.include?('retweeted_status')
    # Parent Tweet
    puts 'Making Parent Tweet'
    parent_json = tweet_json['retweeted_status']
    parent = Tweet.create!(
      twitter_id: parent_json['id_str'],
      text: parent_json['text'],
      created_at: parent_json['created_at']
    )  

    puts 'Making Edge'
    Edge.create!(child: child, parent: parent)
  end
end
