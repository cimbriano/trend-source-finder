class AddInReplyToStatusToTweet < ActiveRecord::Migration
  def change
    add_column :tweets, :in_reply_to_status_str, :string
    add_index  :tweets, :in_reply_to_status_str
  end
end
