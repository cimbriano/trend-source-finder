json.array!(@edges) do |edge|
  # json.extract! edge, :child_id, :parent_id
  json.child_id edge.child.twitter_id
  json.parent_id edge.parent.twitter_id
  json.url edge_url(edge, format: :json)
end
