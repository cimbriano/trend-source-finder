class GraphController < ApplicationController
  def make
    @tweets = Tweet.all
    @edges = Edge.all.includes(:parent).includes(:child)
  end
end
