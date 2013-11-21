class AddRetweetedIdToTweet < ActiveRecord::Migration
  def change
    add_column :tweets, :retweeted_id, :string
  end
end
