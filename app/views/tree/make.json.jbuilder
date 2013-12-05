json.array! @roots do |tweet|
  json.partial! 'tweets/tweet', tweet: tweet
end
