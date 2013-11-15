# == Schema Information
#
# Table name: tweets
#
#  id         :integer          not null, primary key
#  text       :string(255)
#  twitter_id :string(255)
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer
#

class Tweet < ActiveRecord::Base
  belongs_to :user
end
