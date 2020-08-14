num_of_rows=$1

for ((i=1;i<num_of_rows;i=i+1))
do
    ran_id=$((1+$RANDOM%5))
    ran_total=$(($RANDOM%1000))
    mysql -e "insert into stylish.payments(user_id, total) values(${ran_id}, ${ran_total})"
done
