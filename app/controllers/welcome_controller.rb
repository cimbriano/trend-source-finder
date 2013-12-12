class WelcomeController < ApplicationController
  def index
    @topTweets = Tweet.top10
  end
end
