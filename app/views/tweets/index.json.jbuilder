json.array!(@tweets) do |tweet|
  json.extract! tweet, :id, :text, :created_at, :twitter_id
  json.created_at_numeric tweet[:created_at].to_i
  json.url tweet_url(tweet, format: :json)
end
