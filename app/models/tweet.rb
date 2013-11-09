# == Schema Information
#
# Table name: tweets
#
#  id         :integer          not null, primary key
#  text       :string(255)
#  tweet_id   :integer
#  created_at :datetime
#  updated_at :datetime
#

class Tweet < ActiveRecord::Base
end
