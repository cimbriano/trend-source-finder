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

  def self.top10
    top_tweet_id_count_pairs = Edge.group('edges.parent_id').count('edges.child_id').sort_by &:last
    top_tweet_ids = top_tweet_id_count_pairs.last(10).reverse.map {|id, count| id}

    Tweet.includes(:user).find(top_tweet_ids)
  end

  # Class Methods
  def self.singletons
    Tweet.all.select { |t| t.singleton? }
  end

  def self.roots
    Tweet.all.select { |t| t.root? }
  end

  def self.inner_nodes
    Tweet.all.select { |t| t.inner_node? }
  end

  # Instance Methods
  def in_reply_to_status
    Tweet.find_by(twitter_id: in_reply_to_status_str)
  end

  def inner_node?
    retweeted_id.present? || in_reply_to_status_str.present?
  end

  def type_code
    if singleton?
      1
    elsif in_retweet_chain?
      2
    elsif in_reply_chain?
      3
    else
      0
    end
  end

  def singleton?
    # This did not retweet
    # This is not in reply to another tweet
    # This has no children
    retweeted_id.blank? && in_reply_to_status_str.blank? && children.empty?
  end

  def root?
    retweeted_id.blank? && in_reply_to_status_str.blank?
  end

  def retweet?
    retweeted_id.present?
  end

  def reply?
    in_reply_to_status_str.present?
  end

  def in_reply_chain?
    children.any? {|t| t.reply? } || self.reply?
  end

  def in_retweet_chain?
    children.any? {|t| t.retweet?} || self.retweet?
  end
end
