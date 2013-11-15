class CreateTweets < ActiveRecord::Migration
  def change
    create_table :tweets do |t|
      t.string :text
      t.string :twitter_id

      t.timestamps
    end
  end
end
