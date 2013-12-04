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
  has_many :edges, foreign_key: 'parent_id'
  has_many :children, through: :edges

  def in_reply_to_status
    Tweet.find_by(twitter_id: in_reply_to_status_str)
  end

  def singleton?
    # This did not retweet
    # This is not in reply to another tweet
    # This has no children
    retweeted_id.blank? && in_reply_to_status_str.blank? && children.nil?
  end

  def root?
    retweeted_id.blank? && in_reply_to_status_str.blank? && children.any?
  end
end
