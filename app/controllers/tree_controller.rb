class TreeController < ApplicationController
  def make
    @roots = Tweet.roots
  end
end
