class TweetsController < ApplicationController
  before_action :set_tweet, only: [:show, :edit, :update, :destroy]

  # GET /tweets
  # GET /tweets.json
  def index
    @tweets = Tweet.all
  end

  # GET /tweet/1
  # GET /tweet/1.json
  def show
  end

  # GET /tweet/new
  def new
    @tweet = Tweet.new
  end

  # GET /tweet/1/edit
  def edit
  end

  # POST /tweet
  # POST /tweet.json
  def create
  end

  # PATCH/PUT /tweet/1
  # PATCH/PUT /tweet/1.json
  def update
  end

  # DELETE /tweet/1
  # DELETE /tweet/1.json
  def destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tweet
      @tweet = Tweet.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def tweet_params
      params[:Tweet]
    end
end
