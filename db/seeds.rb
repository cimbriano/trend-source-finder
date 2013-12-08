require 'json'

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
  child_user_json = tweet_json['user']
  child_user = User.find_or_create_by(twitter_id: child_user_json['id_str'])
  child_user.add_user_info(child_user_json)
  child_user.save!

  child = Tweet.create!(
    twitter_id: tweet_json['id_str'], # Twitter's ID for this tweet
    text: tweet_json['text'],
    created_at: tweet_json['created_at'],
    retweeted_id: if tweet_json.include?('retweeted_status') then tweet_json['retweeted_status']['id_str'] end,
    in_reply_to_status_str: tweet_json['in_reply_to_status_id_str'],
    user: child_user
  )




  if tweet_json.include?('retweeted_status')
    # Parent Tweet
    puts 'Making Parent Tweet'
    parent_json = tweet_json['retweeted_status']
    parent_user_json = parent_json['user']
    parent_user = User.find_or_create_by(twitter_id: parent_user_json['id_str'])
    parent_user.add_user_info(parent_user_json)
    parent_user.save!


    parent = Tweet.create!(
      twitter_id: parent_json['id_str'],
      text: parent_json['text'],
      created_at: parent_json['created_at'],
      user: parent_user
    )  

    # puts 'Making Edge'
    Edge.create!(child: child, parent: parent)
  end
end
