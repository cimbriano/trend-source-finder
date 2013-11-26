require 'spec_helper'

describe TweetsController do

  let(:valid_attributes) { {} }
  let(:valid_session) { {} }

  describe "GET index" do
    it "assigns all tweets as @tweets" do
      tweet = Tweet.create! valid_attributes
      get :index, {}, valid_session
      assigns(:tweets).should eq([tweet])
    end
  end

  describe "GET show" do
    it "assigns the requested tweet as @tweet" do
      tweet = Tweet.create! valid_attributes
      get :show, {:id => tweet.to_param}, valid_session
      assigns(:tweet).should eq(tweet)
    end
  end

  describe "GET new" do
    it "assigns a new tweet as @tweet" do
      get :new, {}, valid_session
      assigns(:tweet).should be_a_new(Tweet)
    end
  end

  describe "GET edit" do
    it "assigns the requested tweet as @tweet" do
      tweet = Tweet.create! valid_attributes
      get :edit, {:id => tweet.to_param}, valid_session
      assigns(:tweet).should eq(tweet)
    end
  end

end
