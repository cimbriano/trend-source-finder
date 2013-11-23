json.tweets @tweets do |tweet|
  json.extract! tweet, :id, :text, :created_at, :twitter_id, :retweeted_id
  json.created_at_numeric tweet[:created_at].to_i
  json.url tweet_url(tweet, format: :json)
end

json.edges @edges do |edge|
  json.parent_id edge.parent.id
  json.child_id edge.child.id

  # source and target are the indexes of the nodes in the node array
  json.source edge.parent.id - 1
  json.target edge.child.id - 1
end