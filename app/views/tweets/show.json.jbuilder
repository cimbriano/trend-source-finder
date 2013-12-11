json.extract! @tweet, :id, :text, :retweeted_id, :created_at, :in_reply_to_status_str
json.in_reply_chain @tweet.in_reply_chain?
json.in_retweet_chain @tweet.in_retweet_chain?

json.user do
  json.extract! @tweet.user, :id, :name, :user_name, :location, :description, :followers, :friends
end
