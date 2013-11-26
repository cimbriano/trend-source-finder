require 'spec_helper'

describe "edges/new" do
  before(:each) do
    assign(:edge, stub_model(Edge).as_new_record)
  end

  it "renders new edge form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", edges_path, "post" do
    end
  end
end
