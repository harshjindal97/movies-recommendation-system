#include<iostream>
#include<array>
using namespace std;
int main(int argc , char const *argv[]){
    array<int,5> arr1 , arr2;
    arr2.fill(2);
    for(int i=0;i<5;i++){
        cout<<arr2[i]+get<4>(arr1);
    }
    cout<<endl;
    return 0;
}