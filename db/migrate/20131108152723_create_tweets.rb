class CreateTweets < ActiveRecord::Migration
  def change
    create_table :tweets do |t|
      t.string :text
      t.integer :tweet_id

      t.timestamps
    end
  end
end
