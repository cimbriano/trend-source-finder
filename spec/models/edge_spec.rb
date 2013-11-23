# == Schema Information
#
# Table name: edges
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  child_id   :integer
#  parent_id  :integer
#

require 'spec_helper'

describe Edge do
  describe 'Associations' do
    subject(:edge) { FactoryGirl.build(:edge) }

    it { should belong_to :child }
    it { should belong_to :parent }

  end
end
