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

class Tweet < ActiveRecord::Base
  belongs_to :user
  has_one :edge, foreign_key: 'parent_id'
  has_one :child, through: :edge

  def in_reply_to_status
    Tweet.find_by(twitter_id: in_reply_to_status_str)
  end
end
