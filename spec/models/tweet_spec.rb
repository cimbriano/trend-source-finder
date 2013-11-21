# == Schema Information
#
# Table name: tweets
#
#  id           :integer          not null, primary key
#  text         :string(255)
#  twitter_id   :string(255)
#  created_at   :datetime
#  updated_at   :datetime
#  user_id      :integer
#  retweeted_id :string(255)
#

require 'spec_helper'

describe Tweet do
  subject(:tweet) { FactoryGirl.build(:tweet) }

  it { should belong_to(:user) }

end
