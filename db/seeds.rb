require 'json'

def load_synthetic_data
  puts 'Loading synthetic data'

  9.times do
    make_retweet_tree
  end

end

def make_retweet_tree
  singleton_probability = 0.7


  u = make_user
  t = make_tweet(u)

  if rand > singleton_probability # This will not be a singleton
    # How many retweets?
    num_of_retweets = rand(9) + 1 # At least 1, up to 10

    num_of_retweets.times do
      make_retweet(t)
    end
  end
end

def make_user
  User.create!(
    name: Faker::Name.name,
    user_name: Faker::Internet.user_name,
    location: Faker::Address.city,
    description: Faker::Lorem.sentences(1).first,
    followers: rand(20),
    friends: rand(20)
  )
end

def make_tweet(user)
    Tweet.create!(
    twitter_id: Faker::Number.number(10).to_str, # Twitter's ID for this tweet
    text: Faker::Lorem.sentences(1).first,
    user: user
  )
end

def make_retweet(original_tweet)
  t = Tweet.create!(
    twitter_id: Faker::Number.number(10).to_str, # Twitter's ID for this tweet
    text: Faker::Lorem.sentences(1).first,
    created_at: ((original_tweet.created_at.to_time + (rand 600).minutes)).to_datetime, # Adds up to 600 minutes
    retweeted_id: original_tweet.id,
    user: make_user
  )

  Edge.create!(child: t, parent: original_tweet)
end


def load_data_from_source(filename)
  puts "Loading data from: #{filename}"

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
end


case ENV['dataset']
when 'small'
  load_data_from_source('data/tweets.json')
when 'medium'
  load_data_from_source('data/tweets_100.json')
when 'synthetic'
  load_synthetic_data
else
  # Default is the small dataset
  load_data_from_source('data/tweets.json')
end
