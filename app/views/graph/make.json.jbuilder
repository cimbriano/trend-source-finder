json.tweets @tweets do |tweet|
  json.extract! tweet, :id, :text, :created_at, :twitter_id, :retweeted_id
end

json.edges @edges do |edge|
  json.child_id edge.child.twitter_id
  json.parent_id edge.parent.twitter_id
end