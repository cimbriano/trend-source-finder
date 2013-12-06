json.extract! tweet, :id, :created_at, :twitter_id, :retweeted_id, :in_reply_to_status_str
json.created_at_numeric tweet[:created_at].to_i
json.url tweet_url(tweet, format: :json)

json.children tweet.children do |child|
  json.partial! 'tweets/tweet', tweet: child
end
