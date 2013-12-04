require 'json'
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

puts "ENV['dataset'] = #{ENV['dataset']}"

if ENV['dataset'] == 'small'
  filename = 'data/tweets.json'
elsif ENV['dataset'] == 'medium'
  filename = 'data/tweets_100.json'
else
  filename = 'data/tweets.json'
end

puts "Reading data from: #{filename}"


json = File.read(filename)
tweets = JSON.parse(json)

tweets.each do |id, tweet_json|

  # Child Tweet
  puts "Making Child Tweet: #{id}"
  child = Tweet.create!(
    twitter_id: tweet_json['id_str'], # Twitter's ID for this tweet
    text: tweet_json['text'],
    created_at: tweet_json['created_at'],
    retweeted_id: if tweet_json.include?('retweeted_status') then tweet_json['retweeted_status']['id_str'] end,
    in_reply_to_status_str: tweet_json['in_reply_to_status_id_str']
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

    # puts 'Making Edge'
    Edge.create!(child: child, parent: parent)
  end
end
