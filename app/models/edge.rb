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

class Edge < ActiveRecord::Base
  belongs_to :child, class_name: 'Tweet'
  belongs_to :parent, class_name: 'Tweet'
end
