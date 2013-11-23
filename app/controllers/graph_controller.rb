class GraphController < ApplicationController
  def make
    @tweets = Tweet.all
    @edges = Edge.all
  end
end
