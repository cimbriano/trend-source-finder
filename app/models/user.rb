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

  def add_user_info(json)
    self.followers = json['followers_count'].to_i
    self.friends = json['friends_count'].to_i
    self.description = json['description']
    self.location = json['location']
    self.user_name = json['screen_name']
  end
end
