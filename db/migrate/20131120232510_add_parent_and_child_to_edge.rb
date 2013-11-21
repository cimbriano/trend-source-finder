class AddParentAndChildToEdge < ActiveRecord::Migration
  def change
    add_column :edges, :child_id, :integer
    add_column :edges, :parent_id, :integer

    add_index :edges, :child_id
    add_index :edges, :parent_id
  end
end
