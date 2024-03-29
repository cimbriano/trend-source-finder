json.tweets @tweets do |tweet|
  json.extract! tweet, :id, :text, :created_at, :twitter_id, :retweeted_id, :in_reply_to_status_str
  json.created_at_numeric tweet[:created_at].to_i
  json.url tweet_url(tweet, format: :json)
  json.in_reply_chain tweet.in_reply_chain?
  json.in_retweet_chain tweet.in_retweet_chain?
  json.user_name tweet.user.user_name

  json.type tweet.type_code
end

json.edges @edges do |edge|
  json.parent_id edge.parent.id
  json.child_id edge.child.id

  # source and target are the indexes of the nodes in the node array
  json.source edge.parent.id - 1
  json.target edge.child.id - 1
end

json.users @users do |user|
  json.extract! user, :id, :name, :user_name, :location, :followers, :friends
end