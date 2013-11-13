# == Schema Information
#
# Table name: users
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  user_name   :string(255)
#  location    :string(255)
#  url         :string(255)
#  description :string(255)
#  followers   :integer
#  friends     :integer
#  created_at  :datetime
#  updated_at  :datetime
#

class User < ActiveRecord::Base
  has_many :tweets
end
