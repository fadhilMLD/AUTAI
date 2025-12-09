import torch
import torch.nn as nn

# Define the exact same model architecture
class CustomModel(nn.Module):
    def __init__(self, input_size, output_size):
        super(CustomModel, self).__init__()
        self.linear_1 = nn.Linear(2, 64)
        self.output_2 = nn.Linear(64, 1)
    
    def forward(self, x):
        input_0 = x[:, 0:2]
        linear_1_out = self.linear_1(input_0)
        linear_1_out = torch.relu(linear_1_out)
        output_2_out = self.output_2(linear_1_out)
        return output_2_out

# Create model instance and load state dict
model = CustomModel(input_size=2, output_size=1)
model.load_state_dict(torch.load('C:\\Users\\Fadhi\\Downloads\\Essentials\\autai_trained_model\\trained_model.pth'))
model.eval()

with torch.no_grad():
    sample_input = torch.tensor([[1.0, 2.0]], dtype=torch.float32)
    prediction = model(sample_input)
    print(f"Prediction: {prediction}")
    input("Press Enter to continue...")