# == Schema Information
#
# Table name: tweets
#
#  id         :integer          not null, primary key
#  text       :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Tweet < ActiveRecord::Base
end
