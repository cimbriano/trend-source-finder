# == Schema Information
#
# Table name: tweets
#
#  id                     :integer          not null, primary key
#  text                   :string(255)
#  twitter_id             :string(255)
#  created_at             :datetime
#  updated_at             :datetime
#  user_id                :integer
#  retweeted_id           :string(255)
#  in_reply_to_status_str :string(255)
#

require 'spec_helper'

describe Tweet do
  subject(:tweet) { FactoryGirl.build(:tweet) }

  it { should belong_to(:user) }
  it { should respond_to(:in_reply_to_status)}

  describe ':in_reply_to_status' do

    it 'should return a Tweet if we have the original stored' do
      Tweet.create!(text: "Original Text", twitter_id: '88888888888')
      t = Tweet.new(in_reply_to_status_str: '88888888888')
      t.in_reply_to_status.should be_a(Tweet)
    end

  end
end
