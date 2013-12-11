json.extract! tweet, :id, :created_at, :twitter_id, :retweeted_id, :in_reply_to_status_str
json.created_at_numeric tweet[:created_at].to_i
json.url tweet_url(tweet, format: :json)
json.in_reply_chain in_reply_chain?
json.in_retweet_chain tweet.in_retweet_chain?

json.children tweet.children do |child|
  json.partial! 'tweets/tweet', tweet: child
end
